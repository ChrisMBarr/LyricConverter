import { IRawDataFile } from 'src/app/convert/models/file.model';

export const mockSongProFile1: IRawDataFile = {
  name: 'Escape Capsule',
  ext: 'md',
  type: '',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: `@title=Escape Capsule
@artist=Brian Kelly
!bandcamp=https://spilth.bandcamp.com/track/escape-capsule

# Verse 1

Climb a-[D]board [A]
I've been [Bm]waiting for you [F#m]
Climb a-[G]board [D]
You'll be [Asus4]safe in [A7]here

# Chorus 1

[G] I'm a [D]rocket [F#]made for your pro-[Bm]tection
You're [G]safe with me, un-[A]til you leave

# Solo

| [Em] | [D] | [Em] | [D] |
| [Em] | [D] | [Em] | [F#] |
| [B] | [B] | [Bm] | [Bm] |
`,
};

export const mockSongProFile2: IRawDataFile = {
  name: 'Bad Moon Rising',
  ext: 'sng',
  type: '',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: `@title=Bad Moon Rising
@artist=Creedence Clearwater Revival
@capo=1
!difficulty=Easy
!spotify_url=https://open.spotify.com/track/20OFwXhEXf12DzwXmaV7fj?si=cE76lY5TT26fyoNmXEjNpA

# Intro

| [D] | [A] [G] | [D] | [D] |

# Verse 1

[D]I see a [A]bad [G]moon a-[D]rising
[D]I see [A]trouble [G]on the [D]way
[D]I see [A]earth-[G]quakes and [D]lightnin'
[D]I see [A]bad [G]times to-[D]day

# Riff

|-3---5-|
|---4---|

# Chorus

[G]Don't go 'round tonight
It's [D]bound to take your life
[A7]There's a [G]bad moon on the [D]rise

# Verse 2

[D]I hear [A]hurri-[G]canes a-[D]blowing
[D]I know the [A]end is [G]coming [D]soon
[D]I fear [A]rivers [G]over [D]flowing
[D]I hear the [A]voice of [G]rage and [D]ruin

# Chorus

[G]Don't go 'round tonight
It's [D]bound to take your life
[A7]There's a [G]bad moon on the [D]rise

# Solo

| [D] | [A] [G] | [D] | [D] |
| [D] | [A] [G] | [D] | [D] |
| [G] | [G] | [D] | [D] |
| [A7] | [G] | [D] | [D] |

# Verse 3

[D]I hope you [A]got your [G]things to-[D]gether
[D]Hope you are [A]quite pre-[G]pared to [D]die
[D]Look's like we're [A]in for [G]nasty [D]weather
[D]One eye is [A]taken [G]for an [D]eye

# Chorus

Oh [G]don't go 'round tonight
It's [D]bound to take your life
[A7]There's a [G]bad moon on the [D]rise
[A7]There's a [G]bad moon on the [D]rise`,
};
