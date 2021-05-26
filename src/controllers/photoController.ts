import { getConnection } from 'typeorm';
import { getPhotoRepository, Photo, PhotoProps } from '../models/photo';
import { AppContext, AppHandler,  simpleWrapper } from './handlerWrapper';

const getAllPhotoAppHandler: AppHandler<AppContext> = async (req, res, ctx) => {
  const photos = await getConnection().getRepository(Photo).find();
  res.json({ ...photos });
  ctx = {
    ...ctx,
    status:200,
    photos:JSON.stringify(photos),
  };
  return ctx;
};
export const getAllPhotoHandler = simpleWrapper(getAllPhotoAppHandler);

const createPhotoAppHandler: AppHandler<AppContext> = async (req, res, ctx) => {
  if(!req.body.userName){
    throw new Error('Request body does not have value of userName filed');
  }
  const newPhotoProps: PhotoProps  = {
    db:getPhotoRepository(getConnection()),
    userName:req.body.userName,
    filename:req.body.filename,
  };
  const photo = new Photo(newPhotoProps);
  await photo.create();
  res.status(200);
  res.json(photo.id);

  ctx = {
    ...ctx,
    status:200,
    photoId:photo.id,
  };
  return ctx;
};


export const createPhotoHandler = simpleWrapper(createPhotoAppHandler);