import { getConnection } from 'typeorm';
import { PhotoProps, PhotoService } from '../photoComponent/photo';
import {  AppHandler, handlerWrapper,   } from './common/handlerWrapper';

const getAllPhotoAppHandler: AppHandler = async (req, res, next, logger) => {
  const dbConnection = getConnection();
  const photoService = new PhotoService(dbConnection, logger) ;
  const photos = await photoService.find();
  res.json({ ...photos });
  logger.info({
    status:200,
    photos:photos,
  });
};

const createPhotoAppHandler: AppHandler = async (req, res, next, logger) => {
  if(!req.body.userName){
    throw new Error('Request body does not have value of userName filed');
  }
  const newPhotoProps: PhotoProps  = {
    userName:req.body.userName,
    filename:req.body.filename,
    views:req.body.view,
    description:req.body.description,
    isPublished:req.body.isPublished
  };
  const dbConnection = getConnection();
  const photoService = new PhotoService(dbConnection, logger) ;
  const photo = await photoService.create(newPhotoProps);
  res.status(200);
  res.json(photo.id);

  logger.info({
    status:200,
    photoId:photo.id,
  });
};


export const getAllPhotoHandler = handlerWrapper(getAllPhotoAppHandler);
export const createPhotoHandler = handlerWrapper(createPhotoAppHandler);