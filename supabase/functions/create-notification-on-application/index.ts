import { createClient } from '@supabase/supabase-js'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// Create a Supabase client with the service_role key
// Note: It's crucial to use environment variables for sensitive keys in production.
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const payload = await req.json()
    const application = payload.record

    if (payload.type !== 'INSERT' || !application) {
      return new Response(JSON.stringify({ message: 'Not an insert event or no record found' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 1. Get the job details to find the employer_id
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('employer_id, title')
      .eq('id', application.job_id)
      .single()

    if (jobError || !job) {
      console.error('Error fetching job or job not found:', jobError)
      return new Response(JSON.stringify({ error: 'Job not found' }), { status: 404 })
    }

    // 2. Get the applicant's name
    const { data: applicant, error: applicantError } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', application.applicant_id)
      .single()

    if (applicantError || !applicant) {
        console.error('Error fetching applicant profile:', applicantError)
        // We can still proceed without the applicant's name
    }

    const applicantName = applicant?.name || 'A new user';
    const employerId = job.employer_id;
    const jobTitle = job.title;

    // 3. Create the notification for the employer
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: employerId,
        type: 'new_application',
        title: `New Application for ${jobTitle}`,
        message: `${applicantName} has applied for your job: "${jobTitle}".`,
        reference_id: application.id,
        reference_type: 'application'
      })

    if (notificationError) {
      console.error('Error creating notification:', notificationError)
      return new Response(JSON.stringify({ error: 'Failed to create notification' }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, message: 'Notification created' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
