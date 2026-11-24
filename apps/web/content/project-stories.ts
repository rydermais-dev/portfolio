import type { Locale } from './index';

export type EditorialText = Readonly<Partial<Record<Locale, string>> & { 'pt-BR': string }>;

type StoryImage = {
  id: string;
  src: string;
  alt: EditorialText;
  caption?: EditorialText;
};

type BlockHeading = { id: string; title: EditorialText };

export type ProjectBlock =
  | (BlockHeading & { type: 'text'; paragraphs: EditorialText[] })
  | (BlockHeading & { type: 'feature'; paragraphs: EditorialText[]; image: StoryImage })
  | (BlockHeading & { type: 'gallery'; images: StoryImage[] });

export type ProjectStory = {
  category: EditorialText;
  summary?: EditorialText;
  coverOverlay?: string;
  accent: `#${string}`;
  focus: string[];
  blocks: ProjectBlock[];
};

const text = (pt: string, en: string): EditorialText => ({ 'pt-BR': pt, en });
const context = (pt: string, en: string): ProjectBlock => ({
  id: 'context', type: 'text', title: text('O ponto de partida', 'The starting point'), paragraphs: [text(pt, en)],
});
const approach = (title: EditorialText, pt: string, en: string): ProjectBlock => ({
  id: 'approach', type: 'text', title, paragraphs: [text(pt, en)],
});

export const projectStories: Partial<Record<string, ProjectStory>> = {
  singalong: {
    summary: text('Escolha uma faixa, reúna os cantores e leve a letra para uma tela compartilhada. O SingAlong organiza a noite de karaokê da primeira música ao placar final.', 'Pick a track, gather the singers, and put the lyrics on a shared screen. SingAlong takes karaoke night from the first song to the final scoreboard.'),
    accent: '#f17e61',
    category: text('Karaokê multiplayer', 'Multiplayer karaoke'), focus: ['PWA', 'Multiplayer'],
    blocks: [
      context('Uma noite de karaokê tem seu próprio ritmo: escolher uma música, cantar e passar a vez. O SingAlong! leva essa dinâmica para o navegador.', 'A karaoke night has a rhythm of its own: pick a song, sing, and pass the mic. SingAlong! brings that rhythm to the browser.'),
      { id: 'room', type: 'text', title: text('Uma sala, duas telas', 'One room, two screens'), paragraphs: [text('A interface oferece um convite por QR code e um link para abrir a tela de apresentação. A sala também tem ajuste de cores da música e, no fim da sessão, mostra o placar dos cantores.', 'The interface offers a QR invitation and a link to open the presentation screen. The room also offers song color settings and shows the singers’ scoreboard at the end.')] },
    ],
  },
  cedes: {
    summary: text('O site do Centro Espírita Divino Espírito Santo organiza atividades, estudos e horários para quem quer conhecer a instituição ou planejar uma visita.', 'The website of Centro Espírita Divino Espírito Santo organizes activities, study groups, and opening times for visitors.'),
    accent: '#e8ae64',
    category: text('Site institucional', 'Institutional website'), focus: ['Web', 'Conteúdo'],
    blocks: [
      context('Quem procura a instituição pela primeira vez precisa entender o que ela faz e encontrar suas atividades. O site reúne essas informações em um endereço de referência.', 'First-time visitors need to understand what the institution does and find its activities. The site gives them a single place to look.'),
      { id: 'visit', type: 'text', title: text('Da programação à visita', 'From schedule to visit'), paragraphs: [text('A programação semanal ajuda a decidir quando ir. O catálogo de atividades explica o que acontece em cada encontro, dos grupos de estudo ao atendimento fraterno e às ações sociais.', 'The weekly schedule helps visitors decide when to go. The activity listing explains what happens at each gathering, from study groups to community support.')] },
    ],
  },
  rydermais: {
    accent: '#a69af7',
    category: text('Central de projetos', 'Project hub'), focus: ['Web', 'Hub'],
    blocks: [
      context('Jogos, ferramentas e experimentos convivem sob a marca RyderMais. A central reúne trabalhos que, de outra forma, seriam encontrados em endereços diferentes.', 'Games, tools, and experiments share the RyderMais name. The hub gathers work that would otherwise live at separate addresses.'),
      approach(text('Um endereço para explorar', 'One place to explore'), 'A central funciona como porta de entrada para cada produto. A partir dali, a pessoa segue para a experiência que despertou sua curiosidade.', 'The hub is the entry point to each product. Visitors can follow whichever project sparks their curiosity.'),
    ],
  },
  ryan: {
    accent: '#a491f6',
    category: text('Automação para Discord', 'Discord automation'), focus: ['Discord', 'API'],
    blocks: [
      context('Em um servidor de Discord, o bot está onde a comunidade conversa e onde muitas ações recorrentes acontecem. O RYAN complementa esse espaço com um painel e APIs.', 'A Discord bot lives where the community talks and where many recurring actions happen. RYAN complements that space with a dashboard and APIs.'),
      approach(text('Do bot ao painel', 'From bot to dashboard'), 'O bot é o ponto de contato no servidor. O painel fica com a configuração, enquanto as APIs dão às integrações uma interface própria.', 'The bot is the point of contact inside the server. The dashboard handles configuration and the APIs give integrations their own interface.'),
    ],
  },
  beatup: {
    accent: '#fc7d94',
    category: text('Jogo de ritmo', 'Rhythm game'), focus: ['Game UX', 'Multiplatform'],
    blocks: [
      context('No BeatUP, a música marca o tempo da partida. O desafio para quem joga é ler os sinais na tela e responder no momento certo.', 'In BeatUP, music sets the pace of play. The player reads cues on screen and responds at the right moment.'),
      approach(text('Como o ritmo aparece na tela', 'How rhythm appears on screen'), 'A linguagem visual remete às pistas de dança e aos arcades. Setas, luzes e contraste ajudam a dar direção ao olhar.', 'The visual language draws on dance floors and arcades. Arrows, lights, and contrast guide the eye.'),
    ],
  },
  orkuty: {
    coverOverlay: '/images/project-foregrounds/orkuty-login.webp',
    summary: text('Perfis, recados e comunidades voltam a ter endereço. A versão atual do Orkuty recomeça pelo mural e pelos espaços de interesse em comum.', 'Profiles, messages, and communities have a home again. The current Orkuty starts with the wall and spaces built around shared interests.'),
    accent: '#f284b9',
    category: text('Rede social retrô', 'Retro social network'), focus: ['Web', 'UI/UX'],
    blocks: [
      context('O Orkuty parte da memória de uma web feita de perfis, recados e comunidades. A proposta é recuperar a sensação de entrar em um lugar onde os amigos já estão.', 'Orkuty draws on a web built around profiles, scraps, and communities. It aims to recover the feeling of entering a place where your friends already are.'),
      {
        id: 'login', type: 'feature', title: text('O primeiro encontro com o Orkuty', 'The first encounter with Orkuty'),
        paragraphs: [text('A tela de acesso abre com rosa, azul e o logotipo em destaque. O mock atual traz essa composição para o celular e apresenta o caminho de entrada em dois campos e um botão.', 'The sign-in screen opens with pink, blue, and a prominent wordmark. The current mockup brings the composition to a phone, with two fields and one button.')],
        image: { id: 'mobile-login', src: '/images/project-foregrounds/orkuty-login.webp', alt: text('Celular exibindo o formulário de login do Orkuty', 'Phone displaying the Orkuty sign-in form'), caption: text('Mock do login para celular', 'Mobile sign-in mockup') },
      },
      {
        id: 'archive', type: 'gallery', title: text('Do arquivo do projeto', 'From the project archive'),
        images: [
          { id: 'desktop', src: '/assets/images/projects/orkuty/desk-default.jpg', alt: text('Material do Orkuty para desktop', 'Orkuty desktop artwork'), caption: text('Arte original para desktop', 'Original desktop artwork') },
          { id: 'beta', src: '/assets/images/projects/orkuty/banner-closed-beta.png', alt: text('Banner da fase beta fechada do Orkuty', 'Banner for the Orkuty closed beta'), caption: text('Divulgação da beta fechada', 'Closed beta announcement') },
        ],
      },
    ],
  },
  deltaverse: {
    accent: '#efc462',
    category: text('Servidor Minecraft', 'Minecraft server'), focus: ['Minecraft', 'Discord', 'API'],
    blocks: [
      context('A comunidade do Deltaverse circula entre o mundo do Minecraft e o Discord. O projeto explora como conectar esses espaços e oferecer ferramentas para administrar o servidor.', 'The Deltaverse community moves between Minecraft and Discord. The project explores how to connect those spaces and provide tools for managing the server.'),
      approach(text('Do lobby à operação do servidor', 'From the lobby to server operations'), 'O mundo do jogo, o site e o painel atendem a momentos diferentes: jogar, descobrir o servidor e cuidar da operação.', 'The game world, website, and dashboard serve different moments: playing, discovering the server, and managing it.'),
      {
        id: 'archive', type: 'gallery', title: text('Uma visita ao Deltaverse', 'A visit to Deltaverse'),
        images: [
          { id: 'lobby', src: '/assets/images/projects/deltaverse/inGameLobby.png', alt: text('Captura do lobby dentro do servidor Deltaverse', 'Screenshot of the in-game Deltaverse lobby'), caption: text('Lobby dentro do jogo', 'In-game lobby') },
          { id: 'website', src: '/assets/images/projects/deltaverse/website.jpg', alt: text('Captura do site original do Deltaverse', 'Screenshot of the original Deltaverse website'), caption: text('Site original', 'Original website') },
        ],
      },
    ],
  },
  mangut: {
    accent: '#a4d86b',
    category: text('Vitrine de produtos orgânicos', 'Organic product showcase'), focus: ['Recode PRO', 'Web'],
    blocks: [
      context('O Mangut nasceu como trabalho em grupo na Recode PRO. A proposta era dar visibilidade a produtos orgânicos de povos originários por meio de uma vitrine virtual.', 'Mangut began as a group project for Recode PRO. It set out to give organic products from Indigenous communities visibility through an online showcase.'),
      approach(text('A identidade da vitrine', 'The identity of the showcase'), 'A experiência convida a explorar os produtos e conhecer a proposta da vitrine. O carrinho laranja da marca liga essa ideia ao gesto familiar de fazer compras.', 'The experience invites people to browse the products and learn about the showcase. The orange cart in the logo connects that idea to the familiar act of shopping.'),
    ],
  },
  karaotrack: {
    accent: '#c094ff',
    category: text('Letras em tempo real', 'Real-time lyrics'), focus: ['JavaScript', 'Audio'],
    blocks: [
      context('Uma letra vira guia quando acompanha o que está tocando. O karaoTrack.js é um experimento para monitorar e exibir esse texto em tempo real.', 'Lyrics become a guide when they follow the music. karaoTrack.js is an experiment in tracking and displaying that text in real time.'),
      approach(text('Sincronizar som e texto', 'Synchronizing sound and text'), 'O desafio é transformar a posição na música em uma indicação visual que possa ser acompanhada durante a reprodução.', 'The challenge is to turn the current position in the song into a visual cue people can follow during playback.'),
    ],
  },
};
