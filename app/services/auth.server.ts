import { SignupPayload, SigninPayload } from "@/types/user";
import { userSession } from "./sessions.server";

// start ------------------------------ signup ------------------------------
export const signup = async (signupPayload: SignupPayload) => {
  try {
    console.log("signupPayload", signupPayload);
    const { role, confirmPassword, ...signupPayloadWithoutRole } =
      signupPayload;
    console.log(signupPayloadWithoutRole);
    const signupUri = `${process.env.VITE_APP_USER_BACKEND_USER_URL}/signup`;
    console.log("signup is hit", role);
    const signupResponse = await fetch(signupUri, {
      method: "POST",
      body: JSON.stringify(signupPayloadWithoutRole),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.UM_API_KEY!,
      },
      credentials: "include",
      mode: "cors",
    });
    console.log("signupResponse", signupResponse);
    return signupResponse;
  } catch (error) {
    console.error("Auth signup error - auth.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ signup ------------------------------
// start ------------------------------ signin ------------------------------

export const signin = async (signinPayload: SigninPayload) => {
  try {
    const { role, ...signinPayloadWithoutRole } = signinPayload;
    const signinUri = `${process.env.VITE_APP_USER_BACKEND_USER_URL}/signin`;
    console.log("signin is hit", role);
    const signinResponse = await fetch(signinUri, {
      method: "POST",
      body: JSON.stringify(signinPayloadWithoutRole),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.UM_API_KEY!,
      },
      credentials: "include",
      mode: "cors",
    });
    return signinResponse;
  } catch (error) {
    console.error("Auth signin error - auth.server.tsx", error);
    throw new Error("Backend Server did not respond correctly");
  }
};
// end ------------------------------ signin ------------------------------
// start ------------------------------ logout ------------------------------
export const logout = async (role: string, request: Request) => {
  const session = await userSession(request);
  const { accessToken, refreshToken } = session.getAcessAndRefreshToken();
  const logoutUri = `${process.env.VITE_APP_USER_BACKEND_USER_URL}/signout`;
  console.log("Logout is hit", role);
  const logoutResponse = await fetch(logoutUri, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.UM_API_KEY!,
      Cookie: `access-token=${accessToken}; refresh-token=${refreshToken};`,
    },
    credentials: "include",
    mode: "cors",
  });
  return logoutResponse;
};
// end ------------------------------ logout ------------------------------
// start ------------------------------ me ------------------------------
export const me = async (role: string, request: Request) => {
  const session = await userSession(request);
  const { accessToken, refreshToken } = session.getAcessAndRefreshToken();
  const meUri = `${process.env.VITE_APP_USER_BACKEND_USER_URL}/profile`;
  console.log("Get profile is hit", role);
  const meResponse = await fetch(meUri, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.UM_API_KEY!,
      Cookie: `access-token=${accessToken}; refresh-token=${refreshToken};`,
    },
    credentials: "include",
    mode: "cors",
  });
  console.log("meResponse", meResponse);
  return meResponse;
};
// end ------------------------------ me ------------------------------
