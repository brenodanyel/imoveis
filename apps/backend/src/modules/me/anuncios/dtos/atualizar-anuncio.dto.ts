import { PartialType } from '@nestjs/mapped-types';
import { CriarAnuncioDTO } from './criar-anuncio.dto';

export class AtualizarAnuncioDTO extends PartialType(CriarAnuncioDTO) {}
