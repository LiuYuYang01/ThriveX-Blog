import { Request } from '@/utils';
import { Milestone } from '@/types/app/milestone';

export const getMilestoneListAPI = () => Request<Paginate<Milestone[]>>('GET', '/milestone');

export const getMilestoneDataAPI = (id: number) => Request<Milestone>('GET', `/milestone/${id}`);
