import test from 'ava';
import m from './';

test(t => {
	t.is(m('node', ['fixture.js', 'unicorn'], {cwd: __dirname}).toString().trim(), 'unicorn');
});
