import React, { Component } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import
{
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Auth } from "@/request/auth/Auth";
import { ToastType } from "@/App";
import { AuthUtils } from "@/tools/AuthUtils";
import { UserData } from "@/types/Auth";

interface LoginFormProps
{
  showMessage(message: string, type?: ToastType): void
  onLogin: (userData: UserData) => void
}

interface LoginFormState
{
  email: string;
  password: string;
}

export class LoginForm extends Component<LoginFormProps, LoginFormState>
{
  constructor(props: LoginFormProps)
  {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
  {
    const { id, value } = event.target;
    this.setState({ [id]: value } as Pick<LoginFormState, keyof LoginFormState>);
  };

  handleSubmit = async (event: React.FormEvent<HTMLFormElement>) =>
  {
    event.preventDefault();
    const { email, password } = this.state;
    const { showMessage, onLogin } = this.props;
    const result = await Auth.login(email, password);

    if (result.code === 0)
    {
      const userData = result.data;

      if (userData)
      {
        showMessage(result.message, "success");
        AuthUtils.saveUserData(userData);
        onLogin(userData);
      } else
      {
        showMessage(result.message, "info");
      }

    } else
    {
      showMessage(result.message, "warning");
    }

  };

  render()
  {
    const { email, password } = this.state;

    return (
      <div className={cn("flex flex-col gap-6")}>
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={this.handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
}
export default LoginForm;