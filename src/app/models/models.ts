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


export class Video{
  name:string;
  url:string;
  length:string;
}