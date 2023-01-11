import { IClassroom } from "./classroom.interface";
import { ICourse } from "./course.interface";
import { ICurricularUnit } from "./curricular-units.interface";

export interface IAppointment {
  id: string;
  startDate: Date;
  endDate: Date;
  capacityRequired: number;
  curricularUnit: string;
  classroom: string;
  course: string;
  caracteristic: string;
  supervisionalApproval: boolean;
}


export interface IGetAllAppointment {
  id: string;
  startDate: Date;
  endDate: Date;
  capacityRequired: number;
  curricularUnit: string;
  curricularUnitEntity: ICurricularUnit;
  classroom: string;
  classroomEntity: IClassroom;
  course: string;
  courseEntity: ICourse;
  caracteristic: string;
  supervisionalApproval: boolean;
}


export interface ICreateAppointment {
  classroomId: string,
  capacity: number,
  courseId: string,
  curricularUnitId: string,
  shift: string,
  features: string[],
  startDates: Date[],
  endDates: Date[]
}

