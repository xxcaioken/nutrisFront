export interface ImportShortcutDto {
  id: number;
  usuarioEscolaId: number;
  nome: string;
  linkTabelaPrincipal: string;
  linkTabelaDestino: string;
  celulaOrigem: string;
  celulaDestino: string;
  descricao?: string | null;
  dataCriacao: string;
  dataAtualizacao?: string | null;
}

export interface CreateImportShortcutDto {
  usuarioEscolaId: number;
  nome: string;
  linkTabelaPrincipal: string;
  linkTabelaDestino: string;
  celulaOrigem: string;
  celulaDestino: string;
  descricao?: string | null;
}

export interface UpdateImportShortcutDto {
  nome: string;
  linkTabelaPrincipal: string;
  linkTabelaDestino: string;
  celulaOrigem: string;
  celulaDestino: string;
  descricao?: string | null;
} 