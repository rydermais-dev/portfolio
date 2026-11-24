export function Icon({ name }: {
  name: 'link' | 'expand_more' | 'calendar_today' | 'search' | 'close' | 'menu' | 'workspace_premium' | 'chevron_left' | 'chevron_right' | 'arrow_outward' | 'arrow_back' | 'arrow_forward' | 'arrow_downward' | 'mail' | 'contrast' | 'light_mode' | 'dark_mode' | 'location_on' | 'work' | 'shuffle' | 'lightbulb';
}) {
  return <span className="material-symbols-rounded site-icon" aria-hidden="true">{name}</span>;
}
