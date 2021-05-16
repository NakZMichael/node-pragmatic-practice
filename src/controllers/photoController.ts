import { Request, RequestHandler, Response } from 'express';
import { getConnection } from 'typeorm';
import { getPhotoRepository, Photo, PhotoProps } from '../models/photo';

export const getAllPhotoHandler: RequestHandler = async (req,res) => {
  const photos = await getConnection().getRepository(Photo).find();
  return res.json(photos);
};

export const createNewPhotoHandler = async (req: Request,res: Response): Promise<void> => {
  const newPhotoProps: PhotoProps  = {
    db:getPhotoRepository(getConnection()),
    userName:req.body.userName,
    filename:req.body.filename,
  };
  const photo = new Photo(newPhotoProps);
  await photo.create();
  res.status(200);
  res.json(photo.id);
};