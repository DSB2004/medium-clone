import { v4 } from 'uuid';


export const GENERATE_ID: () => string = () => {
    return v4();
}