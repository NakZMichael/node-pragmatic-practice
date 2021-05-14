import { RequestHandler } from 'express';
import { Customer } from '../models/customer';

export const customerHandler: RequestHandler = (req,res) => {
  const name: string = req.body;
  const customer = new Customer(name);
  res.json(customer);
  res.status(200);
};