import { RequestHandler } from 'express';
import { getConnection } from 'typeorm';
import { Photo } from '../models/photo';

export const photoHandler: RequestHandler = async (req,res) => {
  const photos = await getConnection().getRepository(Photo).find();
  return res.json(photos);
};