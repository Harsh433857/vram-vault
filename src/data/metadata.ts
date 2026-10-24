

export const CATEGORY_METADATA: Record<string, { title: string; subtitle: string; icon: string; tag: string }> = {
  'all': {
    title: 'Complete GPU Lineup',
    subtitle: 'Browse all available custom graphics cards spanning 6GB to 48GB VRAM',
    icon: 'Layers',
    tag: 'ALL CARDS'
  },
  '4-8 vram': {
    title: '4 - 8 GB VRAM Series',
    subtitle: 'High efficiency, compact ITX & 1080p high-refresh competitive gaming cards',
    icon: 'Zap',
    tag: '1080P ESPORTS'
  },
  '8-12 vram': {
    title: '8 - 12 GB VRAM Series',
    subtitle: 'Performance sweet spot for 1440p ultra settings, high-fps shooters, and streaming',
    icon: 'Cpu',
    tag: '1440P SWEET SPOT'
  },
  '16-24 vram': {
    title: '16 - 24 GB VRAM Series',
    subtitle: 'Enthusiast-tier graphics engineered for native 4K gaming and heavy 3D rendering',
    icon: 'Flame',
    tag: '4K ENTHUSIAST'
  },
  '24 and above vram': {
    title: '24+ GB VRAM Titan Series',
    subtitle: 'Extreme flagship and workstation compute cards for AI training, simulation, and path tracing',
    icon: 'Crown',
    tag: 'EXTREME TITAN & AI'
  }
};
