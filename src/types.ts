export interface ExePackage {
  url: string;
  path: string;
  fileName: string;
  sha512: string;
  size?: number | null;
}

export interface UpdatePackage {
  url: string;
  path: string;
  fileName: string;
  size: number | string;
  sha512: string;
  blockMapSize: number | string;
}

export interface DownloadData {
  version: string;
  releaseDate: string;
  exe: ExePackage;
  pkg: UpdatePackage;
  source?: 'direct-garena-cdn' | 'upstream-mirror' | 'offline-cache';
}

export interface ReleaseContentSection {
  title: string;
  items: string[];
  body?: string;
}

export interface ReleaseNote {
  version: string;
  showVersion: string;
  date: string;
  rawContent: string;
  sections: ReleaseContentSection[];
}

export interface ApiStatus {
  online: boolean;
  activeSource: 'direct-garena-cdn' | 'upstream-mirror' | 'offline-cache';
  cdnStatus: 'healthy' | 'unreachable';
  mirrorStatus: 'healthy' | 'unreachable';
  cachedVersionsCount: number;
  latestVersion: string;
  latencyMs: number;
}
