/**
 * Types declarations for SDN Karang Anyar 01 Pagi Cinematic App
 */

export interface TechnicalSpecs {
  camera: string;
  lighting: string;
  audio: string;
  vibe: string;
}

export interface CinematicScene {
  id: number;
  title: string;
  description: string;
  narration: string;
  image: string;
  technicalSpecs: TechnicalSpecs;
}

export interface DreamPledgeForm {
  studentName: string;
  dreamProfession: string;
  customPledge: string;
  customInterests: string;
}

export interface DreamAdviceResponse {
  advice: string;
  verse: string;
}
