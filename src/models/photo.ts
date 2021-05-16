import { Entity, Column, PrimaryGeneratedColumn, Repository, Connection, AfterLoad, getConnection } from 'typeorm';

interface PhotoProps{
  db: Repository<Photo>
  userName: string
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
  userName!: string;

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
      this.userName = props.userName;
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

  public create = async (): Promise<void> => {
    if(this.id){
      throw new Error('This object has Id.Maybe it already has been inserted');
    }
    await this.db.insert(this);
  }

  public update = async (): Promise<void> => {
    if(this.id){
      await this.db.save(this);
    }else{
      throw new Error('This object doesn\'t have Id.Maybe it has never been inserted');
    }
  }
}

export function getPhotoRepository(connection: Connection): Repository<Photo>{
  return connection.getRepository(Photo);
}