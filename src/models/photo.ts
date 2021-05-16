import { Entity, Column, PrimaryGeneratedColumn, Repository, Connection, AfterLoad, getConnection } from 'typeorm';

interface PhotoProps{
  db: Repository<Photo>
  name: string
  description?: string
  filename: string
  views?: number
  isPublished?: boolean
}

@Entity()
export class Photo {
  db!: Repository<Photo>

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    length: 100
  })
  name!: string;

  @Column({ nullable:true })
  description?: string;

  @Column({ unique:true })
  filename!: string;

  @Column('double')
  views!: number;

  @Column({ nullable:true })
  isPublished?: boolean;

  constructor(props: PhotoProps){
    // TypeORM create class object with no argument
    // for auto migrations so that props may be undefined...
    //  Same reason make properties to assertion
    if(props){
      this.db = props.db;
      this.name = props.name;
      this.description = props.description;
      this.filename = props.filename;
      this.views = props.views?props.views:0;
    }
  }
  @AfterLoad()
  getDbByGetConnection(): void {
    const connection = getConnection();
    this.db = getPhotoRepository(connection);
  }

  public create = async (): Promise<Photo> => {
    try{
      const createdPhoto = await this.db.save(this);
      return createdPhoto;
    }catch(e){
      console.log('Failed to create');
      throw e;
    }
  }
}

export function getPhotoRepository(connection: Connection): Repository<Photo>{
  return connection.getRepository(Photo);
}