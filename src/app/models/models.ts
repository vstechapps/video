export type Menu={
  name:string;
  click:string;
  route:string;
  icon:string;
}

export class User{
  id:string;
  name:string;
  email:string;
  pic:string;
  role:string;
  phone:string;
  address:string;
  created:string;
  updated:string;
  notifications:boolean;
}

export enum Role{
  USER="USER",
  ADMIN="ADMIN"
}

export class UserFile{
  id:string;
  name:string;
  type:string;
  date:string;
  time:string;
  bytes:number
  user:string;
  size:string;
  icon:string;
  content:string;
  url?:string;
}