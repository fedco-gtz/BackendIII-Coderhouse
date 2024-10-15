import TicketRepository from '../repositories/ticketRepository.js';

class TicketService {
  async createTicket(amount, purchaser) {
    return await TicketRepository.createTicket(amount, purchaser);
  }
}

export default new TicketService();
