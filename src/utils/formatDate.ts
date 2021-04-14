import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export default function formatDate(
  date: string,
  dateNewFormat: string
): string {
  const castedDate = new Date(date);

  return format(castedDate, dateNewFormat, {
    locale: ptBR,
  });
}
