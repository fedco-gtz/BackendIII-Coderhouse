import Ticket from '../models/Ticket.js';

class TicketRepository {
  async createTicket(amount, purchaser) {
    const ticket = new Ticket({
      code: Date.now().toString(),
      purchase_datetime: new Date(),
      amount,
      purchaser,
    });
    return await ticket.save();
  }
}

export default new TicketRepository();
