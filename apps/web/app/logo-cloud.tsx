'use client';

import { motion } from 'motion/react';
import certificates from '../content/certifications.json';

const issuers = Array.from(new Map(certificates.filter((item) => item.issuerLogo).map((item) => [item.emissor, item.issuerLogo])).entries());

export function LogoCloud({ selected, onSelect }: { selected: string; onSelect: (name: string) => void }) {
  return <div className="logo-marquee" aria-label="Filtrar por instituição">
    <motion.div className="logo-track">
      {[0, 1].map((copy) => <div className="logo-group" key={copy} aria-hidden={copy === 1}>
        {issuers.map(([name, logo]) => <button className="logo-cloud-item" type="button" key={name} tabIndex={copy === 1 ? -1 : 0} aria-pressed={selected === name} aria-label={name} onClick={() => onSelect(name)}>
          <img src={logo} alt="" /><span>{name}</span>
        </button>)}
      </div>)}
    </motion.div>
  </div>;
}
