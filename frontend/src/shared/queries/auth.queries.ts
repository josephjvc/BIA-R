import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { register, login } from "../api/auth";
import { useAuthStore } from "../store/auth.store";
import type { RegisterPayload, LoginPayload } from "../types/auth";

export function useRegister() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: RegisterPayload) => register(data),
    onSuccess: (res) => {
      setAuth(res.token, res.user);
      navigate("/");
    },
  });
}

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginPayload) => login(data),
    onSuccess: (res) => {
      setAuth(res.token, res.user);
      navigate("/");
    },
  });
}
