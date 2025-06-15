
import { supabase } from '@/integrations/supabase/client';

export const supabaseService = {
  // Profile management
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  },

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...updates })
      .select();
    
    return { data, error };
  },

  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('active', true)
      .order('name');
    
    return { data, error };
  },

  async getSubcategories(categoryId?: string) {
    let query = supabase
      .from('subcategories')
      .select('*, categories(*)')
      .eq('active', true);
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    const { data, error } = await query.order('name');
    return { data, error };
  },

  // User categories
  async getUserCategories(userId: string) {
    const { data, error } = await supabase
      .from('user_categories')
      .select(`
        *,
        categories(*),
        subcategories(*)
      `)
      .eq('user_id', userId);
    
    return { data, error };
  },

  async addUserCategory(userId: string, categoryId: string, subcategoryId: string, isPrimary = false) {
    const { data, error } = await supabase
      .from('user_categories')
      .insert({
        user_id: userId,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        is_primary: isPrimary
      });
    
    return { data, error };
  },

  // Jobs
  async getJobs(filters: any = {}) {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        profiles:employer_id(name, email),
        categories(name, icon),
        subcategories(name)
      `)
      .eq('status', 'active');

    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    
    if (filters.subcategoryId) {
      query = query.eq('subcategory_id', filters.subcategoryId);
    }
    
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    const { data, error } = await query.order('posted_at', { ascending: false });
    return { data, error };
  },

  async createJob(jobData: any) {
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select();
    
    return { data, error };
  },

  async getJobsByEmployer(employerId: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        categories(name),
        subcategories(name)
      `)
      .eq('employer_id', employerId)
      .order('posted_at', { ascending: false });
    
    return { data, error };
  },

  // Applications
  async applyToJob(jobId: string, applicantId: string, coverLetter?: string) {
    const { data, error } = await supabase
      .from('applications')
      .insert({
        job_id: jobId,
        applicant_id: applicantId,
        cover_letter: coverLetter
      });
    
    return { data, error };
  },

  async getApplicationsByUser(userId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs(*, profiles:employer_id(name, email))
      `)
      .eq('applicant_id', userId)
      .order('applied_at', { ascending: false });
    
    return { data, error };
  },

  async getApplicationsByJob(jobId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        profiles:applicant_id(name, email, phone)
      `)
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false });
    
    return { data, error };
  },

  async updateApplicationStatus(applicationId: string, status: 'pending' | 'accepted' | 'rejected' | 'withdrawn') {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId);
    
    return { data, error };
  },

  // Messages
  async getConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        user1:profiles!user1_id(name, email),
        user2:profiles!user2_id(name, email)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('last_message_at', { ascending: false });
    
    return { data, error };
  },

  async getConversationMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('conversation_messages')
      .select(`
        *,
        profiles:sender_id(name)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    return { data, error };
  },

  async sendMessage(conversationId: string, senderId: string, content: string) {
    const { data, error } = await supabase
      .from('conversation_messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content
      });
    
    return { data, error };
  },

  async createConversation(user1Id: string, user2Id: string) {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user1_id: user1Id,
        user2_id: user2Id
      })
      .select();
    
    return { data, error };
  },

  // Wages
  async getUserWages(userId: string) {
    const { data, error } = await supabase
      .from('wages')
      .select(`
        *,
        categories(name),
        subcategories(name)
      `)
      .eq('user_id', userId);
    
    return { data, error };
  },

  async setUserWage(userId: string, categoryId: string, subcategoryId: string, amount: number, period: string) {
    const { data, error } = await supabase
      .from('wages')
      .upsert({
        user_id: userId,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        amount,
        period
      });
    
    return { data, error };
  },

  // Reports
  async createReport(reportData: any) {
    const { data, error } = await supabase
      .from('reports')
      .insert(reportData);
    
    return { data, error };
  },

  // Verification requests
  async createVerificationRequest(userId: string, documentType: string, documentUrl?: string) {
    const { data, error } = await supabase
      .from('verification_requests')
      .insert({
        user_id: userId,
        document_type: documentType,
        document_url: documentUrl
      });
    
    return { data, error };
  }
};
