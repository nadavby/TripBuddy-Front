
import { FC, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import userService, { IUser } from "../../services/user-service";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import avatar from "../../assets/avatar.png";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

export type formData = z.infer<typeof schema>;

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  img: z.optional(z.instanceof(FileList)),
});

export const RegistrationForm: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  //const inputFileRef= useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<formData>({ resolver: zodResolver(schema) });
  const [watchImg] = watch(["img"]);
  const inputFileRef: { current: HTMLInputElement | null } = { current: null };

  useEffect(() => {
    if (watchImg) {
      setFile(watchImg[0]);
    }
  }, [watchImg]);

  const onSubmit = async (data: formData) => {
    console.log(data);
    const { request } = await userService.uploadImage(file as File);
    request
      .then((res) => {
        console.log(res.data);
        const user: IUser = {
          email: data.email,
          password: data.password,
          imgUrl: res.data.url,
        };
        const { request } = userService.register(user);
        request
          .then((res) => {
            console.log(res.data);
            navigate("/login");
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const onGoogleLoginSuccess = async (response: CredentialResponse) => {
    console.log(response);
    const { request } = userService.googleSignIn(response);
    request
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const onGoogleLoginError = async () => {
    console.log("Google login failed");
  };

  const { ref, ...rest } = register("img");
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        style={{
          width: "100vw",
          display: "flex",
          backgroundColor: "white",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}>

        <div
          className="d-flex flex-column "
          style={{
            width: "60%",
            backgroundColor: "lightblue",
            padding: "20px",
            borderRadius: "10px",
          }}>
          <h1 style={{ alignSelf: "center" }}>Registration Form</h1>
          <img
            src={file ? URL.createObjectURL(file) : avatar}
            alt=""
            style={{
              width: "200px",
              height: "200px",
              alignSelf: "center",
              borderRadius: "50%",
              marginBottom: "10px",
            }}
          />
          <FontAwesomeIcon
            icon={faImage}
            className="fa-xl "
            onClick={() => {
              inputFileRef.current?.click();
            }}
            style={{
              alignSelf: "baseline",
              marginBottom: "20px",
              marginLeft: "275px",
            }}
          />
          <input
            {...rest}
            ref={(e) => {
              ref(e);
              inputFileRef.current = e;
            }}
            id="img"
            type="file"
            className="mb-3"
            accept="image/jpeg,image/png"
            style={{ display: "none" }}
          />
          <label>email:</label>
          <input
            {...register("email")}
            type="email"
            placeholder="Enter your email"
            className="mb"
            style={{ borderRadius: "5px", border: "1px" }}
          />
          {errors.email && (
            <p className="text-danger">{errors.email.message}</p>
          )}
          <label>password:</label>
          <input
            {...register("password")}
            type="password"
            placeholder="Enter your password"
            className="mb-3"
            style={{ borderRadius: "5px", border: "1px" }}
          />
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}
          <button className="btn btn-outline-secondary">Register</button>
          <GoogleLogin
            onSuccess={onGoogleLoginSuccess}
            onError={onGoogleLoginError}
          />
        </div>
      </div>
    </form>
  );
};
