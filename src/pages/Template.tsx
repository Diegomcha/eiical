import { html } from 'hono/html';
import { FC, PropsWithChildren } from 'hono/jsx';

export default ((props) => {
	return html`<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link
					href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
					rel="stylesheet"
					integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
					crossorigin="anonymous"
				/>
				<script
					src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
					integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
					crossorigin="anonymous"
					defer
				></script>

				<title>${props.title}</title>
			</head>
			<body>
				${props.children}
			</body>
		</html>`;
}) satisfies FC<PropsWithChildren<{ title: string }>>;
