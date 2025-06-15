
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedLocalization } from '@/hooks/useEnhancedLocalization';
import { Calendar as CalendarIcon, Clock, MapPin, User } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'interview' | 'work' | 'deadline';
  location?: string;
  contact?: string;
  jobId?: string;
}

const JobCalendar = () => {
  const { user } = useAuth();
  const { t } = useEnhancedLocalization();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    // Mock calendar events
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Construction Interview',
        date: new Date(2025, 0, 16),
        time: '10:00 AM',
        type: 'interview',
        location: 'Mumbai Central',
        contact: 'BuildPro Construction',
        jobId: 'job-1'
      },
      {
        id: '2',
        title: 'Delivery Work',
        date: new Date(2025, 0, 17),
        time: '9:00 AM',
        type: 'work',
        location: 'Pune',
        contact: 'QuickDelivery',
        jobId: 'job-2'
      },
      {
        id: '3',
        title: 'Project Deadline',
        date: new Date(2025, 0, 20),
        time: '6:00 PM',
        type: 'deadline',
        location: 'Chennai',
        contact: 'SecureMax',
        jobId: 'job-3'
      }
    ];
    setEvents(mockEvents);
  }, []);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'interview':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'work':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'deadline':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const addToDeviceCalendar = (event: CalendarEvent) => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(`Contact: ${event.contact}\nLocation: ${event.location}`)}&location=${encodeURIComponent(event.location || '')}`;
    
    window.open(calendarUrl, '_blank');
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <CalendarIcon className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">{t('calendar.title')}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{
              hasEvents: (date) => getEventsForDate(date).length > 0
            }}
            modifiersStyles={{
              hasEvents: { 
                backgroundColor: '#dbeafe', 
                color: '#1e40af',
                fontWeight: 'bold'
              }
            }}
          />
        </Card>

        {/* Events for selected date */}
        <Card className="p-4">
          <h3 className="font-medium text-gray-900 mb-3">
            {selectedDate ? selectedDate.toLocaleDateString() : 'Select a date'}
          </h3>
          
          {selectedDateEvents.length === 0 ? (
            <p className="text-gray-500 text-sm">{t('calendar.noEvents')}</p>
          ) : (
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <div key={event.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>
                      {t(`schedule.${event.type}`, event.type)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>{event.time}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.contact && (
                      <div className="flex items-center space-x-2">
                        <User className="w-3 h-3" />
                        <span>{event.contact}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addToDeviceCalendar(event)}
                    className="mt-2 text-xs"
                  >
                    {t('calendar.addEvent')}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default JobCalendar;
