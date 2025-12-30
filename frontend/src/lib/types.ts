export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  permissionLevel: 'READER' | 'WRITER' | 'EDITOR';
}