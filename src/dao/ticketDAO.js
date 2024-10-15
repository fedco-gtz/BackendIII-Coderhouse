import Ticket from '../models/Ticket.js';
import { v4 as uuidv4 } from 'uuid';

class TicketDAO {
  async create({ amount, purchaser }) {
    const ticket = new Ticket({
      code: uuidv4(),
      purchase_datetime: new Date(),
      amount,
      purchaser,
    });
    return await ticket.save();
  }

  async getById(ticketId) {
    return await Ticket.findById(ticketId);
  }

  async getAll() {
    return await Ticket.find();
  }
}

export default new TicketDAO();
