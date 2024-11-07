import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password_hash = await hash("12345678", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@hotmail.com",
      password_hash,
    },
  });

  const johnDoe = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "johndoe@hotmail.com",
      password_hash,
    },
  });

  const fightClub = await prisma.movie.create({
    data: {
      title: "Fight Club",
      description:
        "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something much more.",
      genre: "Drama",
      year: 1999,
      duration: "2h 19min",
      image_url:
        "https://broadly-images.vice.com/images/2017/01/05/how-fight-club-became-the-bible-of-mens-rights-activists-and-puas-body-image-1483626608.jpg",
      user_id: johnDoe.id,
    },
  });

  await prisma.rating.create({
    data: {
      value: 5,
      comment: "Filme muito ótimo!",
      movie_id: fightClub.id,
      user_id: admin.id,
    },
  });

  await prisma.movie.create({
    data: {
      title: "The Godfather",
      description:
        "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      genre: "Crime",
      year: 1972,
      duration: "2h 55min",
      image_url:
        "https://play-lh.googleusercontent.com/ZucjGxDqQ-cHIN-8YA1HgZx7dFhXkfnz73SrdRPmOOHEax08sngqZMR_jMKq0sZuv5P7-T2Z2aHJ1uGQiys",
      user_id: johnDoe.id,
    },
  });

  await prisma.movie.create({
    data: {
      title: "Scarface",
      description:
        "In Miami, a determined Cuban immigrant takes over a drug cartel and succumbs to greed.",
      genre: "Crime",
      year: 1983,
      duration: "2h 50min",
      image_url:
        "https://s2-g1.glbimg.com/qFXv5GhCjbcOfeuYt2jg38RdRMU=/0x0:1920x1200/1008x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2019/P/F/sXtr9MSFqCatwYBT0Dtw/scarface-al-pacino.jpg",
      user_id: johnDoe.id,
    },
  });

  const heat = await prisma.movie.create({
    data: {
      title: "Heat",
      description:
        "A group of professional bank robbers start to feel the heat from police when they unknowingly leave a clue at their latest heist.",
      genre: "Crime",
      year: 1995,
      duration: "2h 50min",
      image_url:
        "https://m.media-amazon.com/images/M/MV5BMTkxYjU1OTMtYWViZC00ZjAzLWI3MDktZGQ2N2VmMjVjNDRlXkEyXkFqcGc@._V1_.jpg",
      user_id: johnDoe.id,
    },
  });

  await prisma.rating.create({
    data: {
      value: 4,
      comment: "Filme inesquecível!",
      movie_id: heat.id,
      user_id: admin.id,
    },
  });

  await prisma.movie.create({
    data: {
      title: "The Green Mile",
      description:
        "The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.",
      genre: "Drama",
      year: 1999,
      duration: "3h 9min",
      image_url:
        "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p24429_p_v12_bf.jpg",
      user_id: johnDoe.id,
    },
  });

  await prisma.movie.create({
    data: {
      title: "A Beautiful Mind",
      description:
        "After John Nash, a brilliant but asocial mathematician, accepts secret work in cryptography, his life takes a turn for the nightmarish.",
      genre: "Drama",
      year: 2001,
      duration: "2h 15min",
      image_url:
        "https://m.media-amazon.com/images/M/MV5BNzljZTk5ZDgtZTQ1Zi00NTM4LThlOGUtZDk2MGM4NDQ4NWQyXkEyXkFqcGc@._V1_.jpg",
      user_id: johnDoe.id,
    },
  });

  await prisma.movie.create({
    data: {
      title: "Inception",
      description:
        "A thief who enters the dreams of others to steal secrets from their subconscious.",
      genre: "Sci-Fi",
      year: 2010,
      duration: "2h 28min",
      image_url:
        "https://m.media-amazon.com/images/I/912AErFSBHL._AC_UF894,1000_QL80_.jpg",
      user_id: admin.id,
    },
  });

  const theShawshankRedemption = await prisma.movie.create({
    data: {
      title: "The Shawshank Redemption",
      description:
        "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      genre: "Drama",
      year: 1994,
      duration: "2h 22min",
      image_url:
        "https://images.squarespace-cdn.com/content/5c75dfa97d0c9166551f52b1/1639184505697-PU99E09B8ZDV3RHUHZAC/9964546b0ba1f6e14a6045e34b341f8ca2a3569752c5afed95b89682fcde1a68._RI_V_TTW_.jpg?format=1500w&content-type=image%2Fjpeg",
      user_id: admin.id,
    },
  });

  await prisma.rating.create({
    data: {
      value: 5,
      comment: "Filme muito bom!",
      movie_id: theShawshankRedemption.id,
      user_id: admin.id,
    },
  });

  await prisma.movie.create({
    data: {
      title: "The Dark Knight",
      description:
        "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      genre: "Action",
      year: 2008,
      duration: "2h 32min",
      image_url:
        "https://www.hqzona.com.br/wp-content/uploads/2019/03/the-dark-knight.jpeg",
      user_id: admin.id,
    },
  });

  await prisma.movie.create({
    data: {
      title: "Pulp Fiction",
      description:
        "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      genre: "Crime",
      year: 1994,
      duration: "2h 34min",
      image_url:
        "https://occ-0-8407-2219.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABSGtv55T_iUdTa9fXCVk1jXTwYT3kd0SsILKwz_Yb_LI17SXTaRH2vyTXM0A9Syjlex2e5WphqXRyIHMRI5mBuxVAxyA28RQ8uTs.jpg?r=3b9",
      user_id: admin.id,
    },
  });

  const forestGump = await prisma.movie.create({
    data: {
      title: "Forrest Gump",
      description:
        "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
      genre: "Drama",
      year: 1994,
      duration: "2h 22min",
      image_url:
        "https://cdn.ome.lt/LkYr-hZs7sXG-88GsceAwX-0Ixk=/1200x630/smart/extras/conteudos/forrestgump_aTobgrI.jpg",
      user_id: admin.id,
    },
  });

  await prisma.rating.create({
    data: {
      value: 4,
      comment: "Filme emocionante",
      movie_id: forestGump.id,
      user_id: admin.id,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
