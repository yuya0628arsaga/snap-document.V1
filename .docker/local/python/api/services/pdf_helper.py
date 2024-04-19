import pathlib
import re
from io import StringIO

from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage


PDF_DIRPATH = 'api/documents'


class PdfHelper(object):
    """PDFを操作するクラス"""

    def __init__(self):
        pass

    # search_text = 'ョンの表示がでて終了した時）「グラフメニュ」の「表示式」を選択して下さい。Ｓパ'
    def __get_page_from_pdf(self, search_text: str, document_name: str) -> list[int]:
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
            f"{PDF_DIRPATH}/{document_name}.pdf"
        )

        # PDFファイルを1ページずつ見て該当するかチェック
        pages = []
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

                # logger.info(f"{i+1}ページ目のPDF(extracted_text): {extracted_text}")

                # ページ抽出：抽出条件（演習問題のページ）に該当すればTrue
                # 一致した場合：<re.Match object; span=(27, 34), match='S パラメータ'>
                # 一致しなかった場合: None
                extracted_page = re.search(search_text, extracted_text)

                # logger.info(f"extracted_page: {extracted_page}")

                # extracted_page.group() は 検索文字(「S パラメータ」)
                if extracted_page:
                    print(search_text)
                    print(i + 1)
                    pages.append(i + 1)
        return pages

    # texts = ['図 19 解析結果（S パラメータ特性）', 'もしシミュレーションを行なったにもかかわらず表示されない場合は、（シミュレーシ ョンの表示がでて終了した時）「グラフメニュ」の「表示式」を選択して下さい。Ｓパ ラメータバッファの選択と表示式を確認して下さい。もし異なる場合は、図の様にして 下さい。', 'パラメータの選択', '図 20']
    def __get_the_longest_text(self, texts: list[str]) -> str:
        """最も文字数の多いtextを取得

        Args:
            texts (list[str]): textの配列

        Returns:
            str: 最も文字数の多いtext
        """

        sorted_texts = sorted(texts, key=len, reverse=True)
        the_longest_text = sorted_texts[0]

        return the_longest_text

    # AA \n\n BBBBB \n\n CCC \n\n DD から一番長い文章(BBBBB)を取り出し、PDF検索できる形の配列に変換する
    def __extract_main_sentence_list(self, reference_text: str) -> list[str]:
        """最も長い文章を抽出し、PDF検索できる形の配列に変換する

        Args:
            reference_text (str): 回答に参照されたtext（例. AA \n\n BBBBB \n\n CCC \n\n DD）

        Returns:
            list[str]:
        """

        # reference_text = '図 19 解析結果（S パラメータ特性）\n\nもしシミュレーションを行なったにもかかわらず表示されない場合は、（シミュレーシ ョンの表示がでて終了した時）「グラフメニュ」の「表示式」を選択して下さい。Ｓパ ラメータバッファの選択と表示式を確認して下さい。もし異なる場合は、図の様にして 下さい。\n\nパラメータの選択\n\n図 20'

        # 文字列を \n\n で分割して配列化
        noise = '\n\n'
        texts = reference_text.split(noise)

        the_longest_text = self.__get_the_longest_text(texts)

        # MEMO::PDF内に改行が存在する場合、改行をまたぐ検索ができないから以下の処理が必要
        main_sentence_list = the_longest_text.split(' ')

        return main_sentence_list

        # sentence_list = [
        #   'もしシミュレーションを行なったにもかかわらず表示されない場合は、（シミュレーシ',
        #   'ョンの表示がでて終了した時）「グラフメニュ」の「表示式」を選択して下さい。Ｓパ',
        #   'ラメータバッファの選択と表示式を確認して下さい。もし異なる場合は、図の様にして',
        #   '下さい。'
        # ]

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
            # AA \n\n BBBBB \n\n CCC \n\n DD から一番長い文章(BBBBB)を取り出し、PDF検索できる形の配列に変換する
            main_sentence_list = self.__extract_main_sentence_list(reference_text)

            # 最も長い sentence だけで検索をかける（全部かけると処理が遅くなるから）
            main_sentence = self.__get_the_longest_text(main_sentence_list)

            # 0番目のやつだけで検索かければよい（他のでかけても同じ結果が出るはずだから）
            pages = self.__get_page_from_pdf(main_sentence, document_name)

            # もしも検索がヒットしなかった場合、page が[]となり、page[0]でエラーが出る
            if pages:
                pdf_pages.append(pages[0])

        return pdf_pages
