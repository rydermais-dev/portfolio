export function Icon({ name }: {
  name: 'link' | 'expand_more' | 'calendar_today' | 'search' | 'close' | 'workspace_premium' | 'chevron_left' | 'chevron_right' | 'arrow_outward' | 'arrow_back' | 'arrow_forward' | 'arrow_downward' | 'mail' | 'contrast' | 'location_on' | 'work';
}) {
  return <span className="material-symbols-rounded site-icon" aria-hidden="true">{name}</span>;
}
