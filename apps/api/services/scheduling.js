const db = require('../models/database');
const crypto = require('crypto');

class SchedulingService {
  /**
   * Create scheduling link
   */
  createSchedulingLink(userId, options = {}) {
    const user = db.findById('users', userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const schedulingLink = db.create('schedulingLinks', {
      userId,
      organizationId: user.organizationId,
      name: options.name || `Schedule with ${user.firstName} ${user.lastName}`,
      slug: options.slug || this.generateSlug(user.firstName + '-' + user.lastName),
      duration: options.duration || 30, // minutes
      bufferTime: options.bufferTime || 15, // minutes between appointments
      availability: options.availability || this.getDefaultAvailability(),
      bookingWindow: options.bookingWindow || 60, // days in advance
      requiresApproval: options.requiresApproval || false,
      confirmationMessage: options.confirmationMessage || 'Your appointment has been scheduled!',
      reminderSettings: options.reminderSettings || {
        enabled: true,
        hoursBefore: 24
      },
      customFields: options.customFields || [],
      isActive: true,
      url: `${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/schedule/${options.slug || this.generateSlug(user.firstName + '-' + user.lastName)}`
    });
    
    return schedulingLink;
  }

  /**
   * Get available time slots
   */
  getAvailableSlots(schedulingLinkId, date) {
    const link = db.findById('schedulingLinks', schedulingLinkId);
    
    if (!link) {
      throw new Error('Scheduling link not found');
    }
    
    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay();
    const dayAvailability = link.availability[dayOfWeek];
    
    if (!dayAvailability.available) {
      return [];
    }
    
    // Get existing appointments for this date
    const existingAppointments = db.findAll('appointments', {
      userId: link.userId,
      date: requestedDate.toISOString().split('T')[0]
    });
    
    const slots = [];
    const startTime = this.parseTime(dayAvailability.start);
    const endTime = this.parseTime(dayAvailability.end);
    
    // Generate all possible slots
    let currentTime = new Date(requestedDate);
    currentTime.setHours(startTime.hours, startTime.minutes, 0, 0);
    
    const endDateTime = new Date(requestedDate);
    endDateTime.setHours(endTime.hours, endTime.minutes, 0, 0);
    
    while (currentTime < endDateTime) {
      const slotEnd = new Date(currentTime.getTime() + link.duration * 60000);
      
      // Check if slot conflicts with existing appointments
      const hasConflict = existingAppointments.some(apt => {
        const aptStart = new Date(apt.startTime);
        const aptEnd = new Date(apt.endTime);
        return (currentTime < aptEnd && slotEnd > aptStart);
      });
      
      if (!hasConflict && slotEnd <= endDateTime) {
        slots.push({
          start: currentTime.toISOString(),
          end: slotEnd.toISOString(),
          available: true
        });
      }
      
      // Move to next slot (including buffer time)
      currentTime = new Date(slotEnd.getTime() + link.bufferTime * 60000);
    }
    
    return slots;
  }

  /**
   * Book appointment
   */
  bookAppointment(schedulingLinkId, appointmentData) {
    const link = db.findById('schedulingLinks', schedulingLinkId);
    
    if (!link) {
      throw new Error('Scheduling link not found');
    }
    
    // Validate slot availability
    const availableSlots = this.getAvailableSlots(schedulingLinkId, appointmentData.date);
    const requestedSlot = availableSlots.find(slot => 
      slot.start === appointmentData.startTime
    );
    
    if (!requestedSlot) {
      throw new Error('Selected time slot is not available');
    }
    
    const appointment = db.create('appointments', {
      userId: link.userId,
      organizationId: link.organizationId,
      schedulingLinkId,
      title: appointmentData.title || link.name,
      description: appointmentData.description,
      date: appointmentData.date,
      startTime: appointmentData.startTime,
      endTime: new Date(new Date(appointmentData.startTime).getTime() + link.duration * 60000).toISOString(),
      duration: link.duration,
      status: link.requiresApproval ? 'PENDING' : 'CONFIRMED',
      attendees: [{
        name: appointmentData.name,
        email: appointmentData.email,
        phone: appointmentData.phone,
        type: 'CLIENT'
      }],
      location: appointmentData.location || 'To be determined',
      meetingUrl: this.generateMeetingUrl(),
      customFields: appointmentData.customFields,
      confirmationToken: crypto.randomBytes(16).toString('hex'),
      metadata: {
        source: 'SCHEDULING_LINK',
        bookedAt: new Date().toISOString()
      }
    });
    
    // Send confirmation if auto-confirmed
    if (appointment.status === 'CONFIRMED') {
      this.sendConfirmation(appointment);
    }
    
    return appointment;
  }

  /**
   * Confirm appointment
   */
  confirmAppointment(appointmentId) {
    const appointment = db.findById('appointments', appointmentId);
    
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    if (appointment.status !== 'PENDING') {
      throw new Error('Appointment is already confirmed or cancelled');
    }
    
    const updatedAppointment = db.update('appointments', appointmentId, {
      status: 'CONFIRMED',
      confirmedAt: new Date().toISOString()
    });
    
    this.sendConfirmation(updatedAppointment);
    
    return updatedAppointment;
  }

  /**
   * Cancel appointment
   */
  cancelAppointment(appointmentId, reason) {
    const appointment = db.findById('appointments', appointmentId);
    
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    const updatedAppointment = db.update('appointments', appointmentId, {
      status: 'CANCELLED',
      cancelledAt: new Date().toISOString(),
      cancellationReason: reason
    });
    
    // Send cancellation notification
    this.sendCancellation(updatedAppointment);
    
    return updatedAppointment;
  }

  /**
   * Reschedule appointment
   */
  rescheduleAppointment(appointmentId, newDateTime) {
    const appointment = db.findById('appointments', appointmentId);
    
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    // Validate new slot availability
    const link = db.findById('schedulingLinks', appointment.schedulingLinkId);
    const availableSlots = this.getAvailableSlots(appointment.schedulingLinkId, newDateTime.date);
    const requestedSlot = availableSlots.find(slot => 
      slot.start === newDateTime.startTime
    );
    
    if (!requestedSlot) {
      throw new Error('Selected time slot is not available');
    }
    
    const updatedAppointment = db.update('appointments', appointmentId, {
      date: newDateTime.date,
      startTime: newDateTime.startTime,
      endTime: new Date(new Date(newDateTime.startTime).getTime() + link.duration * 60000).toISOString(),
      rescheduledAt: new Date().toISOString(),
      rescheduledCount: (appointment.rescheduledCount || 0) + 1
    });
    
    // Send reschedule notification
    this.sendRescheduleNotification(updatedAppointment);
    
    return updatedAppointment;
  }

  /**
   * Get user calendar
   */
  getUserCalendar(userId, dateRange) {
    const startDate = dateRange?.start || new Date().toISOString();
    const endDate = dateRange?.end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const appointments = db.findAll('appointments', {
      userId,
      status: 'CONFIRMED'
    }).filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= new Date(startDate) && aptDate <= new Date(endDate);
    });
    
    // Group by date
    const calendar = {};
    appointments.forEach(apt => {
      const date = apt.date;
      if (!calendar[date]) {
        calendar[date] = [];
      }
      calendar[date].push(apt);
    });
    
    return calendar;
  }

  /**
   * Get scheduling analytics
   */
  getSchedulingAnalytics(userId, period = 30) {
    const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);
    const appointments = db.findAll('appointments', { userId });
    
    const recentAppointments = appointments.filter(apt => 
      new Date(apt.createdAt) >= startDate
    );
    
    const stats = {
      total: recentAppointments.length,
      confirmed: recentAppointments.filter(a => a.status === 'CONFIRMED').length,
      pending: recentAppointments.filter(a => a.status === 'PENDING').length,
      cancelled: recentAppointments.filter(a => a.status === 'CANCELLED').length,
      completed: recentAppointments.filter(a => a.status === 'COMPLETED').length,
      noShow: recentAppointments.filter(a => a.status === 'NO_SHOW').length,
      averageDuration: recentAppointments.reduce((sum, a) => sum + (a.duration || 0), 0) / (recentAppointments.length || 1),
      rescheduledCount: recentAppointments.filter(a => a.rescheduledCount > 0).length,
      bookingsByDay: this.groupByDay(recentAppointments),
      popularTimes: this.getPopularTimes(recentAppointments)
    };
    
    return stats;
  }

  /**
   * Helper: Generate slug
   */
  generateSlug(text) {
    return text.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + 
      '-' + crypto.randomBytes(4).toString('hex');
  }

  /**
   * Helper: Get default availability
   */
  getDefaultAvailability() {
    return [
      { day: 0, available: false }, // Sunday
      { day: 1, available: true, start: '09:00', end: '17:00' }, // Monday
      { day: 2, available: true, start: '09:00', end: '17:00' }, // Tuesday
      { day: 3, available: true, start: '09:00', end: '17:00' }, // Wednesday
      { day: 4, available: true, start: '09:00', end: '17:00' }, // Thursday
      { day: 5, available: true, start: '09:00', end: '17:00' }, // Friday
      { day: 6, available: false } // Saturday
    ];
  }

  /**
   * Helper: Parse time string
   */
  parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours, minutes };
  }

  /**
   * Helper: Generate meeting URL
   */
  generateMeetingUrl() {
    const meetingId = crypto.randomBytes(8).toString('hex');
    return `https://meet.rubanbleu.com/${meetingId}`;
  }

  /**
   * Helper: Send confirmation
   */
  sendConfirmation(appointment) {
    // In production, this would send actual email
    console.log(`Sending confirmation for appointment ${appointment.id}`);
    
    db.create('notifications', {
      type: 'APPOINTMENT_CONFIRMED',
      recipientId: appointment.attendees[0].email,
      subject: 'Appointment Confirmed',
      message: `Your appointment on ${appointment.date} at ${appointment.startTime} has been confirmed.`,
      appointmentId: appointment.id,
      status: 'SENT'
    });
  }

  /**
   * Helper: Send cancellation
   */
  sendCancellation(appointment) {
    console.log(`Sending cancellation for appointment ${appointment.id}`);
    
    db.create('notifications', {
      type: 'APPOINTMENT_CANCELLED',
      recipientId: appointment.attendees[0].email,
      subject: 'Appointment Cancelled',
      message: `Your appointment on ${appointment.date} has been cancelled.`,
      appointmentId: appointment.id,
      status: 'SENT'
    });
  }

  /**
   * Helper: Send reschedule notification
   */
  sendRescheduleNotification(appointment) {
    console.log(`Sending reschedule notification for appointment ${appointment.id}`);
    
    db.create('notifications', {
      type: 'APPOINTMENT_RESCHEDULED',
      recipientId: appointment.attendees[0].email,
      subject: 'Appointment Rescheduled',
      message: `Your appointment has been rescheduled to ${appointment.date} at ${appointment.startTime}.`,
      appointmentId: appointment.id,
      status: 'SENT'
    });
  }

  /**
   * Helper: Group appointments by day
   */
  groupByDay(appointments) {
    const byDay = {};
    appointments.forEach(apt => {
      const day = new Date(apt.date).toISOString().split('T')[0];
      if (!byDay[day]) {
        byDay[day] = 0;
      }
      byDay[day]++;
    });
    return byDay;
  }

  /**
   * Helper: Get popular booking times
   */
  getPopularTimes(appointments) {
    const times = {};
    appointments.forEach(apt => {
      const hour = new Date(apt.startTime).getHours();
      if (!times[hour]) {
        times[hour] = 0;
      }
      times[hour]++;
    });
    
    return Object.entries(times)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }));
  }
}

module.exports = new SchedulingService();