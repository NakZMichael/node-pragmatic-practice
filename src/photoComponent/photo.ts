import { Entity, Column, PrimaryGeneratedColumn, Repository, Connection, FindConditions } from 'typeorm';
import { WrappedError } from '../error';
import { AppLogger } from '../logging';

interface PhotoProps{
  userName: string
  description?: string
  filename: string
  views?: number
  isPublished?: boolean,
}


@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    length: 100
  })
  userName!: string;

  @Column({ nullable:true })
  description?: string;

  @Column({ unique:true })
  filename!: string;

  @Column({ type:'double', nullable:true })
  views!: number;

  @Column({ nullable:true })
  isPublished?: boolean;
}

// Photo関連のビジネスロジックは全てここに集約する
// Photoのモデルにビジネスロジックを書くとORM特有の制約を受けやすいので 
class PhotoService{

  private repository: Repository<Photo>
  private logger: AppLogger
  constructor(connection: Connection, logger: AppLogger){
    this.repository = connection.getRepository(Photo);
    this.logger = logger;
  }

  create = async (data: PhotoProps): Promise<Photo> => {
    const photo = new Photo();
    Object.assign(photo, data);
    this.logger.info({
      'insert a new photo':'start'
    });
    try{
      await this.repository.insert(photo);
    }catch(e){
      const err = new WrappedError({
        description:'Failed to insert a photo',
        shouldCrash:false,
        logger:this.logger,
        originalError:e
      });
      throw err;
    }
    this.logger.info({
      'insert a new photo':'success'
    });
    return photo;
  }

  find = async (options?: FindConditions<Photo>) => {
    const photos = await this.repository.find(options);
    return photos;
  }
}


export { PhotoService, PhotoProps };