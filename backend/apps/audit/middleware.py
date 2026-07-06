import json
from django.utils.deprecation import MiddlewareMixin
from django.urls import resolve, Resolver404


class AuditMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if request.method not in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return response
        if response.status_code < 200 or response.status_code >= 300:
            return response
        if not request.user or not request.user.is_authenticated:
            return response

        try:
            match = resolve(request.path_info)
            view_func = match.func
            viewset_action = self._get_viewset_action(request.method)
            view_name = match.view_name or ''
            content_type = self._extract_content_type(view_name, match)
            if not content_type:
                return response

            from .models import AuditLog

            object_id = match.kwargs.get('pk') or match.kwargs.get('slug') or ''
            object_repr = ''
            changes = {}

            if hasattr(response, 'data') and response.data:
                if isinstance(response.data, dict):
                    object_repr = str(response.data.get('name') or
                                     response.data.get('title') or
                                     response.data.get('username') or '')
                    if request.method == 'POST':
                        changes = {k: v for k, v in response.data.items()
                                   if not k.startswith('_') and k not in ('id',)}
                    elif request.method in ('PUT', 'PATCH'):
                        if hasattr(request, 'data') and request.data:
                            changes = {k: v for k, v in request.data.items()
                                       if isinstance(v, (str, int, float, bool))}
                    if 'id' in response.data and not object_id:
                        object_id = str(response.data['id'])

            ip = request.META.get('REMOTE_ADDR', '')
            xff = request.META.get('HTTP_X_FORWARDED_FOR', '')
            if xff:
                ip = xff.split(',')[0].strip()

            AuditLog.objects.create(
                user=request.user if request.user.is_authenticated else None,
                action=viewset_action,
                content_type=content_type,
                object_id=object_id,
                object_repr=object_repr[:300],
                changes=changes,
                ip_address=ip,
            )
        except (Resolver404, Exception):
            pass

        return response

    def _get_viewset_action(self, method):
        mapping = {
            'POST': 'create',
            'PUT': 'update',
            'PATCH': 'update',
            'DELETE': 'delete',
        }
        return mapping.get(method, 'update')

    def _extract_content_type(self, view_name, match):
        if view_name:
            parts = view_name.split('-')
            if len(parts) > 1:
                return parts[0]
        url_path = match.route.split('/') if hasattr(match, 'route') else []
        for part in url_path:
            if part and not part.startswith('{') and not part.startswith('<'):
                return part.rstrip('/')
        return ''
