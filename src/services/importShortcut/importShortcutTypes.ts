export interface ImportacaoManagerDto {
  id: number;
  usuarioEscolaId: number;
  nome: string;
  planilhaOrigemUrl: string;
  planilhaDestinoUrl: string;
  celulasMapping: string;
  descricao?: string | null;
  isAtivo: boolean;
  dataCriacao: string;
  dataAtualizacao?: string | null;
  ultimaExecucao?: string | null;
}

export interface CreateImportacaoManagerDto {
  usuarioEscolaId: number;
  nome: string;
  planilhaOrigemUrl: string;
  planilhaDestinoUrl: string;
  celulasMapping: string;
  descricao?: string | null;
  isAtivo?: boolean;
}

export interface UpdateImportacaoManagerDto {
  nome?: string | null;
  planilhaOrigemUrl?: string | null;
  planilhaDestinoUrl?: string | null;
  celulasMapping?: string | null;
  descricao?: string | null;
  isAtivo?: boolean | null;
} 