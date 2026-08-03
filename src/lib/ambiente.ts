/**
 * Sinais de ambiente do app.
 *
 * MODO_DEMO: em DEV sem backend configurado, o app vira uma vitrine navegável
 * com dados de exemplo — impossível em produção (exige DEV **e** ausência de
 * chaves). Serve pra desenvolver a estética e o loop sem depender do Supabase.
 */
import { supabaseConfigurado } from './supabase';

export const MODO_DEMO = import.meta.env.DEV && !supabaseConfigurado;
