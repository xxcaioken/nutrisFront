export interface LinkDto {
  id: number;
  usuarioEscolaId: number;
  nome: string;
  url: string;
  descricao?: string | null;
  dataCriacao: string;
  dataAtualizacao?: string | null;
}

export interface CreateLinkDto {
  usuarioEscolaId: number;
  nome: string;
  url: string;
  descricao?: string | null;
}

export interface UpdateLinkDto {
  nome: string;
  url: string;
  descricao?: string | null;
} 