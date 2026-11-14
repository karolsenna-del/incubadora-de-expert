import importlib.util
from pathlib import Path
import struct
import unittest
from unittest.mock import Mock
import zlib

SPEC = importlib.util.spec_from_file_location('covers', Path(__file__).parents[1] / 'substituir_capas_semana15.py')
m = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(m)
URL = 'https://res.cloudinary.com/demo/image/upload/v123/cover.png'


def image(width=1080, height=1350, color=2):
    def chunk(kind, data):
        return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data))
    return (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, color, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(b'\0' * ((width * (4 if color == 6 else 3) + 1) * height))) + chunk(b'IEND', b''))


class CoversTest(unittest.TestCase):
    def test_exact_mapping_and_real_dimensions(self):
        expected = (
            ('capa-sex-13-11.png', 'rota100k-s15-sex-espera-publico-x-vende-sem'),
            ('capa-sab-14-11.png', 'rota100k-s15-sab-servidor-espera-x-constroi'),
            ('capa-dom-15-11.png', 'rota100k-s15-dom-7-listas-da-semana'),
        )
        self.assertEqual(len(m.MAPPINGS), 3)
        for mapping, (filename, slug) in zip(m.MAPPINGS, expected):
            self.assertEqual(mapping, (f'{m.ASSETS}/{filename}', f'instagram-carrosseis/{slug}/slide-01', f'.github/workflows/post-{slug}.yml'))
            m.allowed(mapping)
            m.png((m.ROOT / mapping[0]).read_bytes())

    def test_rgb_rgba_and_bad_png(self):
        for color in (2, 6):
            m.png(image(color=color))
        for data in (image(width=1079), image(height=1349), image(color=0), b'not png', image()[:-5]):
            with self.assertRaises((ValueError, struct.error)):
                m.png(data)

    def test_only_first_url_changes_byte_for_byte(self):
        for mapping in m.MAPPINGS:
            original = (m.ROOT / mapping[2]).read_bytes()
            first = __import__('re').search(rb'"(https://[^"\n]+/slide-01.png)"', original)[1]
            expected = original.replace(first, URL.encode(), 1)
            updated = m.replace_cover(mapping, original, URL)
            self.assertEqual(updated, expected)
            self.assertEqual(original.split(first, 1)[1], updated.split(URL.encode(), 1)[1])
            self.assertEqual(original.split(first, 1)[0], updated.split(URL.encode(), 1)[0])

    def test_reject_every_mapping_component(self):
        mapping = m.MAPPINGS[0]
        for index in range(3):
            bad = list(mapping)
            bad[index] += '-unauthorized'
            for operation in (
                lambda: m.allowed(tuple(bad)),
                lambda: m.upload(tuple(bad), image(), ('cloud', 'key', 'secret'), Mock()),
                lambda: m.replace_cover(tuple(bad), b'', URL),
            ):
                with self.assertRaises(ValueError):
                    operation()

    def test_cloudinary_mock_and_signature(self):
        mapping = m.MAPPINGS[0]
        session = Mock()
        session.post.return_value.json.return_value = dict(public_id=mapping[1], secure_url=URL, width=1080, height=1350)
        self.assertEqual(m.upload(mapping, image(), ('demo', 'key', 'secret'), session), URL)
        kwargs = session.post.call_args.kwargs
        self.assertEqual(kwargs['data']['overwrite'], 'true')
        self.assertEqual(kwargs['data']['invalidate'], 'true')
        self.assertEqual(kwargs['data']['public_id'], mapping[1])
        self.assertNotIn('secret', kwargs['data'])
        params = {k: v for k, v in kwargs['data'].items() if k not in ('api_key', 'signature')}
        signature = m.hashlib.sha1(('&'.join(f'{k}={v}' for k, v in sorted(params.items())) + 'secret').encode()).hexdigest()
        self.assertEqual(kwargs['data']['signature'], signature)

    def test_bad_responses(self):
        mapping = m.MAPPINGS[0]
        valid = dict(public_id=mapping[1], secure_url=URL, width=1080, height=1350)
        for field, value in [('public_id', mapping[1].replace('01', '02')), ('width', 1), ('height', 1), ('secure_url', 'http://res.cloudinary.com/a'), ('secure_url', 'https://evil.example/a'), ('secure_url', None)]:
            with self.assertRaises(ValueError):
                m.response_url(mapping, {**valid, field: value})

    def test_verify_download(self):
        session = Mock()
        session.get.return_value.status_code = 200
        session.get.return_value.content = image()
        m.verify(URL, session)
        session.get.return_value.status_code = 302
        with self.assertRaises(ValueError):
            m.verify(URL, session)
        session.get.return_value.status_code = 200
        session.get.return_value.content = image(width=2)
        with self.assertRaises(ValueError):
            m.verify(URL, session)

    def test_push_retries_and_conflict(self):
        from unittest.mock import patch
        calls = []
        def fake(*args, **kwargs):
            calls.append(args)
            return Mock(returncode=1 if args[0] == 'push' else 0, stdout='', stderr='rejected')
        with patch.object(m, 'git', side_effect=fake):
            with self.assertRaisesRegex(RuntimeError, '3 tentativas'):
                m.commit_push()
        self.assertEqual(sum(c[0] == 'push' for c in calls), 3)
        self.assertEqual([c for c in calls if c[0] == 'add'], [('add', '--', item[2]) for item in m.MAPPINGS])
        with patch.object(m, 'git', side_effect=RuntimeError('conflito')):
            with self.assertRaisesRegex(RuntimeError, 'conflito'):
                m.commit_push()


if __name__ == '__main__':
    unittest.main()
