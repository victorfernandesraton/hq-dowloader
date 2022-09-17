import { HQInfo } from './types/hqinfo.type'

type SearchItemProps = HQInfo

export function SearchItem({
	name,
}: SearchItemProps) {
	return (
		<div>
			<p>{name}</p>
			<p>Listar capítulos</p>
			<p>Baixar</p>
		</div>
	)
}