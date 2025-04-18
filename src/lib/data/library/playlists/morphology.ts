import { transformImages } from '$lib/utils';

const images = transformImages(
  import.meta.glob('$lib/assets/playlistLibrary/morphology/**/*.{png,jpg,jpeg}', {
    query: { enhanced: true },
    import: 'default',
    eager: true,
  }),
);

const morphology: BlendLibrary.Section = {
  title: 'Morphology',
  items: [
    { type: 'playlist', name: 're-', id: 're', image: images['re'] },
    { type: 'playlist', name: 'con-', id: 'con', image: images['con'] },
    { type: 'playlist', name: 'ex-', id: 'ex', image: images['ex'] },
    { type: 'playlist', name: 'inter-', id: 'inter', image: images['inter'] },
    { type: 'playlist', name: 'trans-', id: 'trans', image: images['trans'] },
    { type: 'playlist', name: 'de-', id: 'de', image: images['de'] },
    { type: 'playlist', name: '-tract-', id: 'tract', image: images['tract'] },
    { type: 'playlist', name: '-vis-', id: 'vis', image: images['vis'] },
  ],
};

export default morphology;
