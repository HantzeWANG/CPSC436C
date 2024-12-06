release: cd frontend && npm install && npm run build && cd ../backend && python manage.py collectstatic --noinput
web: gunicorn backend.wsgi --log-file -
