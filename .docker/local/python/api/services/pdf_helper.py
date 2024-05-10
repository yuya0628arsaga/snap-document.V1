import pathlib
import re
from io import StringIO

from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage


PDF_STORE_LOCAL_DIR = 'api/documents'


class PdfHelper(object):
    """PDFを操作するクラス"""

    def __init__(self):
        pass

    # search_text = 'もしシミュレーションを行なったにもかかわらず表示されない場合は、（シミュレーシ ョンの表示がでて終了した時）「グラフメニュ」の「表示式」を選択して下さい。Ｓパ ラメータバッファの選択と表示式を確認して下さい。もし異なる場合は、図の様にして 下さい。'
    def _get_page_from_pdf(self, search_text: str, document_name: str) -> list[int]:
        """検索ワードに一致するPDFのページを出力する

        Args:
            search_text (str): 検索ワード
            document_name (str): 検索対象のPDF名

        Returns:
            list[int]: 検索にヒットしたPDFのページ
        """
        # pdfminerの設定
        rsrcmgr = PDFResourceManager()
        codec = 'utf-8'
        laparams = LAParams()
        laparams.detext_vertical=True

        pdf_path = pathlib.Path(
            # 'api/documents/Man_Digest_v9.pdf'
            f"{PDF_STORE_LOCAL_DIR}/{document_name}.pdf"
        )

        make_search_text = self._make_search_text(search_text)
        print('make_search_text: ', make_search_text)

        # PDFファイルを1ページずつ見て該当するかチェック
        pages = []
        try:
            with open(pdf_path, 'rb') as fp:
                for i, page in enumerate(PDFPage.get_pages(fp)):
                    outfp = StringIO()
                    device = TextConverter(
                        rsrcmgr=rsrcmgr, # PDFResourceManagerオブジェクトを設定する
                        outfp=outfp, # 出力先のストリームオブジェクトを設定する
                        codec=codec,
                        laparams=laparams # LAParamsオブジェクトを設定する
                    )
                    interpreter = PDFPageInterpreter(rsrcmgr, device)
                    interpreter.process_page(page)

                    # 1ページ分のPDF（for文で回しているため i+1 ページ目のPDF）を文字列化したもの
                    extracted_text = outfp.getvalue()

                    extracted_page = re.search(make_search_text, extracted_text)

                    # extracted_page.group() は 一致した文字(例. 「S パラメータ」)
                    if extracted_page:
                        print(search_text)
                        print(i + 1)
                        pages.append(i + 1)

            return pages
        except FileNotFoundError:
            print(f"PDF: {document_name} が存在しません。")
            raise
        except Exception:
            print(f"PDF 検索エラー")
            raise

    def _make_search_text(self, search_text: str) -> str:
        """正規表現での検索時にエラーや改行による不一致が出ないように検索対象の文字列を加工

        Args:
            search_text (str): 検索ワード

        Returns:
            str: 検索できる文字列
        """
        make_search_text = search_text.replace('\\', '\\\\') # C:MEL\\Lib\\bin とかのバックスラッシュを検索できるように
        make_search_text = make_search_text.replace(' ', '[\s\S]*?') # 改行の空白を実際の改行にする（これでPDF内の改行に一致させることができる）
        make_search_text = f"({make_search_text})+"

        return make_search_text


    # texts = ['図 19 解析結果（S パラメータ特性）', 'もしシミュレーションを行なったにもかかわらず表示されない場合は、（シミュレーシ ョンの表示がでて終了した時）「グラフメニュ」の「表示式」を選択して下さい。Ｓパ ラメータバッファの選択と表示式を確認して下さい。もし異なる場合は、図の様にして 下さい。', 'パラメータの選択', '図 20']
    def _get_the_longest_text(self, texts: list[str]) -> str:
        """最も文字数の多いtextを取得

        Args:
            texts (list[str]): textの配列

        Returns:
            str: 最も文字数の多いtext
        """
        # deleted_line_texts = [text.rstrip(' ') for text in texts] # 改行を除去した上で一番長い文字列がどれかを比較
        # print(f"改行除去した: ", deleted_line_texts)

        sorted_texts = sorted(texts, key=len, reverse=True)
        the_longest_text = sorted_texts[0]

        print(f"一番長いテキスト: ", the_longest_text)

        return the_longest_text

    # AA \n\n BBBBB \n\n CCC \n\n DD から一番長い文章(BBBBB)を取り出す
    def _extract_main_sentence(self, reference_text: str) -> str:
        """reference_text から最も長い文章を抽出する

        Args:
            reference_text (str): 回答に参照されたtext（例. AA \n\n BBBBB \n\n CCC \n\n DD）

        Returns:
            str:
        """

        # reference_text = '図 19 解析結果（S パラメータ特性）\n\nもしシミュレーションを行なったにもかかわらず表示されない場合は、（シミュレーシ ョンの表示がでて終了した時）「グラフメニュ」の「表示式」を選択して下さい。Ｓパ ラメータバッファの選択と表示式を確認して下さい。もし異なる場合は、図の様にして 下さい。\n\nパラメータの選択\n\n図 20'

        # 文字列を \n\n で分割して配列化
        noise = '\n\n'
        texts = reference_text.split(noise)
        the_longest_text = self._get_the_longest_text(texts)

        return the_longest_text

    # ベクトル検索で取得したtextを元に、そのtextがpdfのどこに書いてあるのか文字列一致検索をかけてpdfページを取得
    def get_pdf_pages(self, reference_texts: list[str], document_name: str) -> list[int]:
        """PDFページを取得する

        Args:
            reference_texts (list[str]): 回答のために参照したPDFの文章
            document_name (str): 検索対象のドキュメント名

        Returns:
            list[int]: PDFのページ
        """
        pdf_pages = []

        for reference_text in reference_texts:
            # AA \n\n BBBBB \n\n CCC \n\n DD から一番長い文章(BBBBB)を取り出す
            main_sentence = self._extract_main_sentence(reference_text)

            pages = self._get_page_from_pdf(main_sentence, document_name)

            # もしも検索がヒットしなかった場合、page が[]となり、page[0]でエラーが出る
            if pages:
                pdf_pages.append(pages[0])

        pdf_pages = self._remove_duplicates(pdf_pages)

        return pdf_pages

    def _remove_duplicates(self, pdf_pages):
        """配列の重複削除

        Args:
            pdf_pages (list[int]): PDFページの配列

        Returns:
            list[int]: PDFページの配列
        """
        pdf_page_set = set(pdf_pages)

        return list(pdf_page_set)