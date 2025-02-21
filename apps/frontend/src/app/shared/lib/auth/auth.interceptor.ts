import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const newReq = req.clone({
    url: `${API_URL}/${req.url}`,
  });

  if (newReq.url.includes('/auth/')) {
    return next(newReq);
  }

  const token = authService.getAccessToken();
  if (token) {
    const authReq = newReq.clone({
      headers: newReq.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(authReq);
  }

  return next(newReq);
};
