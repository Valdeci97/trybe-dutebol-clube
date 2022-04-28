export default interface ILoginSucess {
  user: {
    id: number;
    username: string;
    role: string;
    email: string;
  },
  token: string;
}
