import Bookmarks from "@/modules/Bookmarks";

// TODO: remove mock!
const data = Array.from({ length: 20 }).map((__, index) => ({
  id: index.toString(),
  timestamp: new Date().valueOf(),
  name: `${index} ASd assss asdasdasd asdasdqwe qw qwrwe assasdasd asdasdasd rwerw ewerwerwerwe`,
}));

const App = () => {
  return <Bookmarks data={data} />;
};

export default App;
