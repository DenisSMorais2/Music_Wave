# 🎵 MusicWave

Uma aplicação web moderna de reprodução de música que oferece uma experiência completa de player de áudio com funcionalidades avançadas de gerenciamento de biblioteca musical e playlists personalizadas.

## 🚀 Funcionalidades

### 🎶 **Player de Música Completo**
- **Visualização de capas**: Exibe automaticamente a capa do álbum extraída dos metadados do arquivo de áudio
- **Player modal**: Interface dedicada com capa rotativa durante a reprodução e controles completos
- **Controles avançados**: Play/pause, próxima, anterior, shuffle, repeat (all/one), ajuste de volume
- **Barra de progresso**: Navegação temporal com indicadores de tempo atual e duração total
- **Detecção automática de metadados**: Extrai automaticamente título, artista, álbum e capa dos arquivos MP3

### 📚 **Gerenciamento de Biblioteca**
- **Upload múltiplo**: Suporte para adicionar várias músicas simultaneamente
- **Busca inteligente**: Sistema de pesquisa que procura por título, artista ou álbum
- **Biblioteca interativa**: Interface completa para navegar e gerenciar toda a coleção musical
- **Suporte a múltiplos formatos**: MP3, WAV, M4A, FLAC

### 🎵 **Sistema de Playlists**
- **Criação de playlists**: Interface intuitiva para criar novas playlists personalizadas
- **Adicionar às playlists**: Funcionalidade para adicionar músicas às playlists existentes
- **Capa dinâmica**: A capa da playlist é automaticamente atualizada com a última música adicionada
- **Playlist "Liked Songs"**: Sistema de músicas favoritas com coração
- **Reprodução de playlist**: Reproduz playlists completas com um clique

### 👤 **Perfil de Usuário**
- **Informações pessoais**: Configuração de nome e foto de perfil
- **Upload de avatar**: Suporte para adicionar foto pessoal
- **Estatísticas**: Contadores de músicas, playlists e favoritas
- **Persistência de dados**: Todas as configurações são salvas localmente

### 🔍 **Busca e Navegação**
- **Aba Search**: Exibe todas as músicas adicionadas com funcionalidade de busca
- **Navegação por abas**: Home, Search, Your Library com interfaces específicas
- **Responsivo**: Interface adaptável para desktop e mobile
- **Tema escuro**: Design moderno com gradientes e efeitos visuais

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e elemento `<audio>` nativo
- **CSS3**: Estilização avançada com Tailwind CSS e animações customizadas
- **JavaScript ES6+**: Lógica de aplicação com classes e programação orientada a objetos
- **Web APIs**: FileReader, URL.createObjectURL, localStorage
- **Bibliotecas externas**:
  - **jsmediatags**: Extração de metadados de arquivos de áudio
  - **Font Awesome**: Ícones vetoriais
  - **Tailwind CSS**: Framework de CSS utilitário

## 📁 Estrutura do Projeto

```
musicwave/
├── index.html          # Arquivo principal da aplicação
├── README.md          # Documentação do projeto
└── assets/            # (opcional) Pasta para recursos adicionais
    ├── icons/         # Ícones personalizados
    └── screenshots/   # Capturas de tela da aplicação
```

## 🚀 Como Usar

### Instalação
1. Clone ou baixe o repositório
2. Abra o arquivo `index.html` em um navegador moderno
3. Não há necessidade de servidor web - funciona localmente

### Primeiros Passos
1. **Upload de Músicas**: Clique no botão "Upload Music" ou use o botão flutuante (mobile)
2. **Selecione Arquivos**: Escolha um ou múltiplos arquivos de áudio
3. **Reprodução**: Clique em qualquer música para iniciar a reprodução
4. **Player Modal**: Clique na capa da música na barra inferior para abrir o player completo

### Criando Playlists
1. Navegue para "Your Library"
2. Clique no ícone "+" ao lado de "Playlists" no menu lateral
3. Digite o nome da playlist e confirme
4. Adicione músicas usando o botão "+" ao lado de cada faixa

### Personalizando Perfil
1. Clique no avatar do usuário no canto superior direito
2. Selecione "Profile" no menu dropdown
3. Adicione seu nome e foto de perfil
4. Visualize suas estatísticas de uso

## 🎨 Recursos Visuais

- **Interface Dark**: Design moderno com tema escuro
- **Animações Suaves**: Transições e efeitos hover responsivos
- **Capa Rotativa**: Efeito visual durante a reprodução no player modal
- **Gradientes**: Elementos visuais com gradientes coloridos
- **Cards Interativos**: Hover effects e botões de ação contextuais
- **Layout Responsivo**: Adaptação automática para diferentes tamanhos de tela

## 💾 Armazenamento de Dados

A aplicação utiliza **localStorage** para persistir:
- Lista de músicas (metadados apenas)
- Playlists criadas pelo usuário
- Músicas favoritas
- Configurações do usuário
- Preferências de reprodução (volume, shuffle, repeat)

> **Nota**: Os arquivos de áudio não são armazenados permanentemente. É necessário fazer upload novamente após fechar o navegador.

## 🔧 Configurações e Personalização

### Formatos Suportados
- **MP3**: Formato principal com suporte completo a metadados
- **WAV**: Áudio não comprimido
- **M4A**: Formato Apple/iTunes
- **FLAC**: Áudio sem perdas

### Navegadores Compatíveis
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## 🐛 Resolução de Problemas

### Música não reproduz
- Verifique se o formato do arquivo é suportado
- Confirme se o navegador permite reprodução automática
- Teste com outros arquivos de áudio

### Metadados não aparecem
- Alguns arquivos podem não ter metadados embedados
- A biblioteca jsmediatags pode ter limitações com certos formatos
- Metadados são extraídos automaticamente quando disponíveis

### Performance
- Muitos arquivos grandes podem impactar a performance
- A aplicação carrega metadados assincronamente para melhor experiência
- Considere a quantidade de arquivos para dispositivos com menos memória

## 📱 Uso Mobile

- **Menu lateral**: Acesso através do botão de menu (☰)
- **Botão flutuante**: Upload rápido de músicas
- **Touch gestures**: Interface otimizada para toque
- **Responsividade**: Layout adaptado automaticamente

## Design

![musicwave](https://github.com/user-attachments/assets/03820c3c-6b0e-453a-a5a5-86366f3cacd6)

![musicwave_2](https://github.com/user-attachments/assets/e027b29d-9290-41c0-9146-ba5ec623c299)

## 🔮 Futuras Melhorias

- [ ] Equalizer visual
- [ ] Suporte a mais formatos de áudio
- [ ] Sincronização com serviços de nuvem
- [ ] Compartilhamento de playlists
- [ ] Visualizador de espectro de áudio
- [ ] Modo offline completo
- [ ] Integração com APIs de música

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Submeter pull requests
- Melhorar a documentação

---

**MusicWave** - Transforme seu navegador em um centro musical completo! 🎵✨
