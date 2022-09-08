type RequestParams<T> = {
	method?: 'GET' | 'POST',
	body?: T
	signal?: AbortSignal,
}

export const request = ({
	method = 'GET',
	body,
	signal
}: RequestParams<string>) => {
	const options = {
		method,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		signal,
		body
	}
	return fetch('https://admin.hq-now.com/graphql', options)
}