import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

// This should probably be made for DI instead since I want to access the Document.
// That would let me unit test. For now, I'm more interested in making this work at all.
// https://angular.dev/guide/http/interceptors#di-based-interceptors
export function csrfInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement).content;
  const requestWithCsrf = request.clone({
    headers: request.headers.set('X-CSRF-Token', csrfToken)
  });
  return next(requestWithCsrf);
}